const express = require("express");

const router = express.Router();

const { homePage, aboutPage, contactPage, affliatePage, licensePage, faqPage, termsPage, startguidePage,policyPage,cryptoPage, registerPage, loginPage, register_post, login_post, loginAdmin, logout_get } = require("../controllers/userController");
const { loginAdmin_post } = require("../controllers/adminController");

router.get("/", homePage);

router.get("/about", aboutPage);

router.get("/contact", contactPage);

router.get("/faq", faqPage);

router.get("/terms", termsPage)
router.get("/privacy",policyPage);
router.get("/copy-trader", cryptoPage);

router.get("/crypto-trading", startguidePage);

router.get("/forex", affliatePage);

router.get("/stocks", licensePage)

router.get("/register", registerPage);
router.post('/register',register_post);

router.get("/login", loginPage);
router.post('/login',login_post);

router.get('/loginAdmin', loginAdmin);
router.post('/loginAdmin', loginAdmin_post)

router.get('/logout', logout_get)









module.exports = router;