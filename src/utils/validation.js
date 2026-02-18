export const emailValidation = {
  required: "信箱必填",
  pattern: {
    value: /^\S+@\S+$/i,
    message: "Email 格式不正確",
  }             
}

export const passwordValidation = {
  required: "密碼必填",
  minLength: {
    value: 6,
    message: "密碼長度至少需 6 碼",
  }
}