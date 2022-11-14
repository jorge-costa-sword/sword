const bcrypt = require("bcrypt");
const jwt = require("jwt-simple");
const config = require("../../config");
const { User } = require("../models");
const ApiError = require("../common/api-error");

class UserService {
  async register(data) {
    const validation = this.validateUser(data);
    if (!validation.valid) {
      throw new ApiError(validation.message, 412);
    }

    const { name, email, password, role } = data;

    await this.checkUserExists(email);

    const user = {
      name,
      email: email.toLowerCase(),
      password: bcrypt.hashSync(password, 10),
      role,
    };

    const resp = await User.create(user);
    return this.buildUserOutput(resp);
  }

  async login(email, password) {
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      raw: true,
    });
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new ApiError("Unauthorized", 401);
    }

    const tokenData = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.encode(tokenData, config.api.secretKey);
    return { ...this.buildUserOutput(user), token };
  }

  async checkUserExists(email) {
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      raw: true,
    });

    if (user) {
      throw new ApiError(`User already exists with email ${email}`, 409);
    }
    return false;
  }

  buildUserOutput(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  validateUser(data) {
    const requiredAttrs = ["name", "email", "password", "role"];
    const missingAttrs = [];

    for (let x = 0; x < requiredAttrs.length; x += 1) {
      if (!data[requiredAttrs[x]]) {
        missingAttrs.push(requiredAttrs[x]);
      }
    }

    let msg = "";

    if (missingAttrs.length) {
      msg = `Please fill all the required attributes: ${missingAttrs.join(
        ","
      )}`;
    }

    return { valid: !msg.length, message: msg };
  }
}

module.exports = UserService;
