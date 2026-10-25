import {User} from "../model/user.model.js"

export const updateUserByEmail = async (email,updatedData)=>{
    return await User.findOneAndUpdate(
        {email:email},
        updatedData,
        {returnDocument: 'after'}).select('-password');
};

export const deleteUserById = async (id)=>{
    return await User.deleteOne({_id:id});
};

export const findUserById = async (id) => {

    return User.findOne({ _id: id, isDeleted: false }, { password: 0 }, {});
};

