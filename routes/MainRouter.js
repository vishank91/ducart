const MainRouter = require("express").Router()

const MaincategoryMainRouter = require("./MaincategoryRoutes")
const SubcategoryRouter = require("./SubcategoryRoutes")
const BrandRouter = require("./BrandRoutes")
const TestimonialRouter = require("./TestimonialRoutes")
const ProductRouter = require("./ProductRoutes")
const UserRouter = require("./UserRoutes")
const CartRouter = require("./CartRoutes")
const WishlistRouter = require("./WishlistRoutes")
const CheckoutRouter = require("./CheckoutRoutes")
const NewsletterRouter = require("./NewsletterRoutes")
const ContactUsRouter = require("./ContactUsRoutes")

MainRouter.use("/maincategory", MaincategoryMainRouter)
MainRouter.use("/subcategory", SubcategoryRouter)
MainRouter.use("/brand", BrandRouter)
MainRouter.use("/testimonial", TestimonialRouter)
MainRouter.use("/product", ProductRouter)
MainRouter.use("/user", UserRouter)
MainRouter.use("/cart", CartRouter)
MainRouter.use("/wishlist", WishlistRouter)
MainRouter.use("/checkout", CheckoutRouter)
MainRouter.use("/newsletter", NewsletterRouter)
MainRouter.use("/contactus", ContactUsRouter)


module.exports = MainRouter