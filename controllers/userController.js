const router = require('express').Router();
const userService = require('../service/user')

const { isGuest, isUser } = require('../service/guards')

router.post('/follow/:id', isUser(), async (req, res) => {

    const follower = req.user._id;

    try {
        await userService.followUser(req.params.id, follower)
        res.status(200).json({ "message": "successfully followed" })
    } catch (error) {
        res.status(401).json({ "error-message": error.message })
        console.log(error)
    }
})

router.post('/unfollow/:id', isUser(), async (req, res) => {

    const follower = req.user._id;

    try {
        await userService.unFollowUser(req.params.id, follower)
        res.status(200).json({ "message": "successfully unfollowed" })
    } catch (error) {
        res.status(401).json({ "error-message": error.message })
        console.log(error)
    }
})
router.patch('/bookmark/:id', isUser(), async (req, res) => {

    

    try {
        await userService.addToBookmarks(req.params.id, req.user._id)
        res.status(200).json({ "message": "successfully added to Bookmarks" })
    } catch (error) {
        res.status(401).json({ "error-message": error.msg })
        console.log(error)
    }
})
router.delete('/bookmark/:id', isUser(), async (req, res) => {

    

    try {
        await userService.removeFromBookmarks(req.params.id, req.user._id)
        res.status(200).json({ "message": "successfully removed from Bookmarks" })
    } catch (error) {
        res.status(401).json({ "error-message": error.msg })
        console.log(error)
    }
})
router.get('/bookmarked',  async (req, res) => {
    
    try {
        const bookmarks = await userService.getBookmarks(req.user._id);
        
        bookmarks.forEach(x => {
            x.author = x.author.username;

            x.createdAt = x.createdAt.toISOString().split('T')[0];

            x.readTime = Math.ceil(x.description.split(' ').length / 200)

        })
        
        res.status(200).json(bookmarks)
    } catch (error) {
        res.status(400).json({ "error-message": error.message })
        console.log(error)
    }
})

module.exports = router;