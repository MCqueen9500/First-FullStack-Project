const listing = require('../collections/listing');
const review = require('../collections/reviews');

module.exports.createReview = async (req,res)=>{
    let {id} = req.params;
    let list = await listing.findById(id);
    let rev1 = await new review(req.body.review);
    rev1.created_by = req.user._id;
    list.reviews.push(rev1);
    await list.save()
    await rev1.save()
    res.redirect(`/listing/${id}`)
}

module.exports.deleteReview = async (req,res)=>{
    let {id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`)
}