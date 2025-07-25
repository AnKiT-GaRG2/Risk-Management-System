import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const generateAccessAndRefreshTokens = async (admin) => {
    try {
        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();

        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};


const adminLogin = asyncHandler(async (req, res) => {
    console.log("Attempting admin login...");
    console.log('Mongoose Connection State:', mongoose.connection.readyState);

    const { emailOrUsername, password } = req.body;

    const admin = await Admin.findOne({
        $or: [{ username: emailOrUsername }, { email: emailOrUsername }]
    }).select('+password');

    if (!admin) {
        throw new ApiError(400, 'Invalid credentials');
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
        throw new ApiError(400, 'Invalid credentials');
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(admin);
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        sameSite: 'Lax', // Protects against some CSRF attacks
    };
    const accessTokenExpiry = parseInt(process.env.ACCESS_TOKEN_EXPIRY_MS);
    if (isNaN(accessTokenExpiry)) {
        throw new ApiError(500, 'ACCESS_TOKEN_EXPIRY_MS environment variable is not a valid number.');
    }
    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: accessTokenExpiry });
    const refreshTokenExpiry = parseInt(process.env.REFRESH_TOKEN_EXPIRY_MS);
    if (isNaN(refreshTokenExpiry)) {
        throw new ApiError(500, 'REFRESH_TOKEN_EXPIRY_MS environment variable is not a valid number.');
    }
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: refreshTokenExpiry });

    res.status(200).json(
        new ApiResponse(
            200,
            { 
                admin: {
                    id: admin._id,
                    username: admin.username,
                    email: admin.email, 
                    role: admin.role,
                },
            },
            'Login successful'
        )
    );
});


const logoutAdmin = asyncHandler(async (req, res) => {
    await Admin.findByIdAndUpdate(
        req.user._id,
        { $set: { refreshToken: undefined } },
        { new: true }
    );
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax'
    };

    res.status(200)
        .clearCookie('accessToken', cookieOptions) 
        .clearCookie('refreshToken', cookieOptions) 
        .json(new ApiResponse(200, null, 'Logged out successfully'));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, 'Unauthorized request: No refresh token provided');
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const admin = await Admin.findById(decodedToken.id);

        if (!admin) {
            throw new ApiError(401, 'Invalid refresh token: User not found');
        }

        if (incomingRefreshToken !== admin.refreshToken) {
            throw new ApiError(401, 'Refresh token tampered or expired');
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(admin);

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
        };

        const accessTokenExpiry = parseInt(process.env.ACCESS_TOKEN_EXPIRY_MS);
        if (isNaN(accessTokenExpiry)) {
            throw new ApiError(500, 'ACCESS_TOKEN_EXPIRY_MS environment variable is not a valid number.');
        }
        res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: accessTokenExpiry });

        const refreshTokenExpiry = parseInt(process.env.REFRESH_TOKEN_EXPIRY_MS);
        if (isNaN(refreshTokenExpiry)) {
            throw new ApiError(500, 'REFRESH_TOKEN_EXPIRY_MS environment variable is not a valid number.');
        }
        res.cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: refreshTokenExpiry });

        res.status(200).json(
            new ApiResponse(
                200,
                { 
                    admin: {
                        id: admin._id,
                        username: admin.username,
                        email: admin.email, 
                        role: admin.role,
                    },
                },
                'Tokens refreshed successfully'
            )
        );

    } catch (error) {
        console.error("Refresh token error:", error);
        if (error instanceof jwt.TokenExpiredError) {
            throw new ApiError(401, 'Refresh token expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new ApiError(401, 'Invalid refresh token');
        }
        throw new ApiError(500, error.message || 'Server error during token refresh');
    }
});

// Optional: Admin registration (for initial setup, then disable or remove)
const registerAdmin = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    const adminExists = await Admin.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    });
    if (adminExists) {
        throw new ApiError(400, 'Admin already exists');
    }

    const admin = await Admin.create({ username, email, password, role });

    res.status(201).json(
        new ApiResponse(
            201,
            {
                admin: {
                    id: admin._id,
                    username: admin.username,
                    email: admin.email,
                    role: admin.role,
                },
            },
            'Admin registered successfully'
        )
    );
});


export { adminLogin, logoutAdmin, refreshAccessToken, registerAdmin };