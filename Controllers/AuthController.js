const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken')
const UserModel = require('../Models/UserModel');
const ProductModel = require('../Models/ProductModel');
const OTP = require('../Models/OTPModel');
// const nodemailer = require('nodemailer')
require('dotenv').config()

class AuthController {
    static Register = async (req, res) => {
        const imagePath = req.file ? req.file.path : null;


        const { name, email, password, phone, role, companyName, companyDescription } = req.body

        try {
            const user = await UserModel.findOne({ email: { $regex: email, $options: 'i' } });
            if (user) {
                return res.status(200).json({
                    success: false,
                    message: "Email already exists."
                })
            }

            const salt = await bcrypt.genSalt(10)
            const HashPassword = await bcrypt.hash(password, salt)

            const CreateAccount = new UserModel({
                name,
                email,
                password: HashPassword,
                phone,
                role,
                companyName: companyName,
                companyDescription: companyDescription,
                companyImage: imagePath

            })

            await CreateAccount.save()

            res.status(200).json({
                success: true,
                message: "User has been registered."
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }

    }

    static Login = async (req, res) => {
        const { email, password } = req.body;

        try {
            const emailExist = await UserModel.findOne({ email: { $regex: email, $options: 'i' } })
            
            if (emailExist) {
                bcrypt.compare(password, emailExist.password, async (err, result) => {
                    
                    if (err || !result) {
                        return res.status(200).json({
                            success: false,
                            message: err ? err.message : "Password doen't match."
                        });
                    }
                    else if (result) {
                        const token = JWT.sign({
                            id: emailExist._id,
                            name: emailExist.name,
                            email: emailExist.email,
                            phone: emailExist.phone,
                            companyName: emailExist.companyName,
                            role: emailExist.role,
                        }, 
                        process.env.TOKEN, 
                        {
                            expiresIn: "365d"
                        });
    
                        res.status(200).json({
                            success: true,
                            path: process.env.APP_URL,
                            data: {
                                _id: emailExist._id,
                                name: emailExist.name,
                                email: emailExist.email,
                                phone: emailExist.phone,
                                UserProfile: emailExist.UserProfile,
                                companyName: emailExist.companyName,
                                companyImage: emailExist.companyImage,
                                companyDescription: emailExist.companyDescription,
                                role: emailExist.role,
                                token: token,
                            },
                        });
                    }
                })
            }
            else{
                res.status(200).json({
                    success: false,
                    message: "User isn't exist."
                });
            }
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            });
        }

    }

    static ForgetPassword = async (req, res) => {

        const { email } = req.body;
        if (email) {
            const userExist = await UserModel.findOne({ email: email })
            if (userExist) {
                const otp = Math.floor(1000 + Math.random() * 9000);
                // Store the OTP in the database
                const otpData = new OTP({
                    userId: userExist._id,
                    otpCode: otp,
                });
                await otpData.save();

                // Send the OTP via email
                // const transporter = nodemailer.createTransport({
                //     service: 'Gmail', // E.g., 'Gmail', 'Yahoo', etc.
                //     auth: {
                //         user: 'senderemail',
                //         pass: '************',
                //     },
                // });
                // const mailOptions = {
                //     from: 'senderemail',
                //     to: email,
                //     subject: 'OTP Code Of Password',
                //     text: `Your OTP For Password Reset Is: ${otp}`,
                // };
                // transporter.sendMail(mailOptions, (error, info) => {
                //     if (error) {
                //         res.status(200).json({
                //             success: false,
                //             message: error.message
                //         });
                //     } else {
                        res.status(200).json({
                            success: true,
                            message: `OTP Sent Successfully ${otp}.`,
                            id: userExist._id,
                            OTP: otp
                        });
                //     }
                // });

            } else {
                res.status(200).json({
                    success: false,
                    message: "Email doesn't exist."
                })
            }
        }
        else {
            res.status(200).json({
                success: false,
                message: "Email must be required."
            })
        }
    }

    static ForgetPasswordCodeVerify = async (req, res) => {
        try {
            const code = req.params.code
            const Userid = req.params.id

            if (!code || !Userid) {
                return res.status(200).json({
                    success: false,
                    message: !code ? "Code must be filled." : "User id must be filled."
                })
            }
            const codeVerified = await OTP.findOne({ otpCode: code, userId: Userid })

            if (!codeVerified) {
                return res.status(200).json({
                    success: false,
                    message: "Code doesn't verified."
                })
            }
            res.status(200).json({
                success: true,
                message: "Code has been verified."
            })

        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

    static ChangeForgetPassword = async (req, res) => {
        try {
            const {id, password} = req.body

            if (!id || !password) {
                return res.status(200).json({
                    success: false,
                    message: "Filled all fields."
                })
            }

            const salt = await bcrypt.genSalt(10)
            const HashPassword = await bcrypt.hash(password, salt)

            const codeVerified = await UserModel.findOneAndUpdate({_id: id},{
                $set: {
                    password: HashPassword
                }
            }, {new: true})

            res.status(200).json({
                success: true,
                message: "Password has been changed successfuly.",
                data: codeVerified
            })

        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

    static GetMyProducts = async (req, res) => {
        const UserId = req.user._id
        try {
            if(req.user.role !== "User"){
                const myAllProduct = await ProductModel.find({userId: UserId})

                return res.status(200).json({
                    success: true,
                    data: req.user,
                    myProducts: myAllProduct
                })
            }
            res.status(200).json({
                success: false,
                message: "You aren't eligible to see other products."
            })
           
        } catch (error) {
            res.status(200).json({
                success: false,
                data: error.message
            })
        }
    }

    static ChangePassword = async (req, res) => {
        const { currentPassword, newPassword } = req.body
        try {
            bcrypt.compare(currentPassword, req.passwordKey, async (err, result) => {
                    
                if (err || !result) {
                    return res.status(200).json({
                        success: false,
                        message: err ? err.message : "Password doen't match."
                    });
                }
                else if (result) {
                    const salt = await bcrypt.genSalt(10)
                    const HashPassword = await bcrypt.hash(newPassword, salt)
        
                    await UserModel.findOneAndUpdate({_id: req.user._id},{
                        $set: {
                            password: HashPassword
                        }
                    })
        
                    res.status(200).json({
                        success: true,
                        message: "Password has been changed successfuly."
                    })
                }
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

    static EditProfile = async (req,res) =>{


        const currentUser = req.user
        const {name, phone, companyName, companyDescription} = req.body
        const companyImage = req.files['companyImage'] ? req.files['companyImage'][0] : null;
        const profileImage = req.files['profileImage'] ? req.files['profileImage'][0] : null;



        try {

            const UserData = await UserModel.findOne({_id: currentUser._id})

            if(name){
                UserData.name = name
            }
            if(phone){
                UserData.phone = phone
            }
            if(companyName){
                UserData.companyName = companyName
            }
            if(companyDescription){
                UserData.companyDescription = companyDescription
            }

            if(companyImage) {
                UserData.companyImage = companyImage.path
            }

            if(profileImage) {
                UserData.UserProfile = profileImage.path
            }


            await UserData.save()



            res.status(200).send({
                message:"user data",
                data: UserData
            })
            
        } catch (error) {
            res.status(401).send({
                message:"error",
                error: error
              
            })
        }
    }

}



module.exports = AuthController;
