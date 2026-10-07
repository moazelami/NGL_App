import {User} from '../../user/model/user.model.js';

export const checkUserExistByEmail = async (email) => {
    return await User.findOne({ email: email });
};

export const createUser = async (userData)=>{
    return await User.create(userData);
};

// auth.repo.js
export const updatePassword = async (email, hashedPassword) => {
    return await User.updateOne({ email }, { password: hashedPassword });
};



