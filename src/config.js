module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || "development",
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "*",
    JWT_SECRET:
        process.env.JWT_SECRET ||
        "mtKZAb_45iFMHKTF64ghtbWSDFDGNXSBFHHYyjkujsEWTdEwfdEWHTRFKIKioiLPOUITLGKJ09875tretbsfgukXNFvbc",
    JWT_EXPIRY: process.env.JWT_EXPIRY || "3h",
    DATABASE_URL:
        process.env.DATABASE_URL ||
        "postgresql://gnmap:password@localhost/mapforge",
    TEST_DATABASE_URL:
        process.env.TEST_DATABASE_URL ||
        "postgresql://gnmap:password@localhost/mapforge-test",
};
