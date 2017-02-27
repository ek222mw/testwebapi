/*jshint esversion:6 */
//Schema for users which name is Login.
let mongoose = require("mongoose");
let bcrypt = require("bcryptjs");
let SALT_WORK_FACTOR = 10;
// declare schema.
let userSchema = mongoose.Schema({
  username: { type: String, required: true, unique:true },
});


//standard way to do the pre save with hash, from: https://www.npmjs.com/package/bcrypt-nodejs
userSchema.pre('save', function(next) {
    var user = this;

//hashed the password if modified or new.
    if (!user.isModified('password')) return next();

    // generating a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password with the salt
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);

                // overwrite the clear pass with the hashed.
                user.password = hash;
                next();
            });
        });
});
//standard way to compare, from:https://www.npmjs.com/package/bcrypt-nodejs
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err)
        {
          return cb(err);
        }
        cb(null, isMatch);
    });
};


let User = mongoose.model('User', userSchema);
module.exports = User;
