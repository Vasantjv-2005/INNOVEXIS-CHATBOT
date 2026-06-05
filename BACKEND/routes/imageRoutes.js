const express = require("express");

const router =
    express.Router();

const {
    createImage,
} = require(
    "../controllers/imageController"
);

router.post(
    "/generate",
    createImage
);

module.exports =
    router;