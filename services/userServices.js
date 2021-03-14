const { bodyectID } = require('mongodb');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const userInDb = require('../repository/userCheckInDb')
const recordInDb = require('../repository/identicalRecordDocCheck')
const response = require('../helper/response-handle')
const userValidation = require('../models/loginValJoiSchema')
const customError = require('../helper/appError')


const userSignup = async (body) => {
    try {
        const users = await userInDb.userFindOne({ $or: [{ email: body.email }, { userName: body.userName }] })
        if (users != null) {
            throw new customError.BadInputError('Username or Email already exist');
        } else {
            const user = new User({
                //_id: new Mongoose.Schema.Types.ObjectId,
                name: body.name,
                userName: body.userName,
                password: body.password,
                email: body.email,
                isAdmin: body.isAdmin,
                dob: body.dob,
            })

            await user.save();
            return;

        }

    } catch (error) {
        throw error;
    }


}

const userLogin = async (body) => {
    try {
        const user = await userInDb.userFindOne({ userName: body.userName })

        if (user === null) {
            throw new customError.NotFoundError('No User with this username found');
        } else {
            const match = await bcrypt.compare(body.password, user.password); //password encrypted

            const newLocal = user._id
            if (match) {
                const token = jwt.sign({
                    userId: newLocal,
                    isAdmin: user.isAdmin,                                   //JWT creation
                }, process.env.KEY, { expiresIn: '1h' });

                return token;
            } else {
                throw new customError.AuthorizationError('Authorization Failed');

            }

        }

    } catch (error) {
        throw error;
    }
}

const userGetDetails = async (params, userData) => {
    try {
        if (userData.isAdmin) {
            const users = await userInDb.userFindAllWithoutId(parseInt(params.from), parseInt(params.to))

            return users;
        } else {
            throw new customError.AuthorizationError('Forbidden');
        }
    } catch (error) {
        throw error;
    }
}

const userControlAdmin = async (body, userData) => {
    try {
        if (userData.isAdmin) {
            const user = await userInDb.userFindOne({ userName: body.userName });

            if (user === null) {
                throw new customError.NotFoundError('No User with this username found');
            } else if (user.isAdmin === body.isAdmin) {
                throw new customError.BadInputError('Same Status');
            } else {
                user.isAdmin = body.isAdmin;

                await user.save();
                return res.status(200).json(response(true, null, 'Admin Status Changed'));

            }
        } else {
            throw new customError.AuthorizationError('Forbidden');
        }

    } catch (error) {
        throw error;
    }

}



module.exports = { userSignup, userLogin, userGetDetails, userControlAdmin }