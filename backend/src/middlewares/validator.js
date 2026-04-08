import { body, param, validationResult } from 'express-validator';

export const validatedResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array().map(e => ({
                field: e.path,
                message: e.msg
            }))
        });
    }
    next();
};

export const CreateUserValidator = [
    body("name").notEmpty().withMessage("Tên không được để trống").trim().isLength({ min: 2, max: 50 }).withMessage("Tên phải từ 2-50 ký tự"),
    body("email").notEmpty().withMessage("Email không được để trống").bail().isEmail().withMessage("Email sai định dạng").normalizeEmail(),
    body("password").optional().isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    }).withMessage("Mật khẩu dài ít nhất 8 ký tự, trong đó có ít nhất 1 ký tự hoa, 1 ký tự thường, 1 ký tự số và 1 ký tự đặc biệt"),
    body("role").optional().isIn(['user', 'admin']).withMessage("Role phải là 'user' hoặc 'admin'"),
    body("phone").optional().isMobilePhone('vi-VN').withMessage("Số điện thoại không hợp lệ"),
    body("clerkId").optional().isString().trim()
];

export const RegisterValidator = [
    body("name").notEmpty().withMessage("Tên không được để trống").trim().isLength({ min: 2, max: 50 }).withMessage("Tên phải từ 2-50 ký tự"),
    body("email").notEmpty().withMessage("Email không được để trống").bail().isEmail().withMessage("Email sai định dạng").normalizeEmail(),
    body("password").notEmpty().withMessage("Mật khẩu không được để trống").bail().isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    }).withMessage("Mật khẩu dài ít nhất 8 ký tự, trong đó có ít nhất 1 ký tự hoa, 1 ký tự thường, 1 ký tự số và 1 ký tự đặc biệt"),
    body("phone").optional().isMobilePhone('vi-VN').withMessage("Số điện thoại không hợp lệ")
];

export const ChangePasswordValidator = [
    body("oldpassword").notEmpty().withMessage("Mật khẩu cũ không được để trống"),
    body("newpassword").notEmpty().withMessage("Mật khẩu mới không được để trống").bail().isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    }).withMessage("Mật khẩu dài ít nhất 8 ký tự, trong đó có ít nhất 1 ký tự hoa, 1 ký tự thường, 1 ký tự số và 1 ký tự đặc biệt")
];

export const UpdateUserValidator = [
    body("name").optional().trim().isLength({ min: 2, max: 50 }).withMessage("Tên phải từ 2-50 ký tự"),
    body("email").optional().isEmail().withMessage("Email sai định dạng").normalizeEmail(),
    body("password").optional().isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    }).withMessage("Mật khẩu dài ít nhất 8 ký tự, trong đó có ít nhất 1 ký tự hoa, 1 ký tự thường, 1 ký tự số và 1 ký tự đặc biệt"),
    body("role").optional().isIn(['user', 'admin']).withMessage("Role phải là 'user' hoặc 'admin'"),
    body("phone").optional().isMobilePhone('vi-VN').withMessage("Số điện thoại không hợp lệ"),
    body("isDisable").optional().isBoolean().withMessage("isDisable phải là true hoặc false")
];

export const UserIdValidator = [
    param("id").isInt({ min: 1 }).withMessage("ID người dùng phải là số nguyên dương")
];

export const UpdateRoleValidator = [
    body("role").isIn(['user', 'admin']).withMessage("Role phải là 'user' hoặc 'admin'")
];

