document.addEventListener("DOMContentLoaded", (e) =>{
    //stable elements
    let cafeName = document.querySelector(".cafe-name")
    let cafeAddress = document.querySelector(".cafe-address")
    let cafeImgContainer = document.querySelector(".cafe-image-container")
    let cafeAvgHeartContainer = document.querySelector(".avg-cafe-hearts")
    let leaveReviewForm = document.querySelector(".review-form")
    let cafeReviewUL = document.querySelector(".reviews")
    let displayedCafe = {}

    fetch("http://localhost:3000/cafes/1")
        .then(res => res.json())
        .then((cafeObj) => {
            displayedCafe = cafeObj
            cafeName.innerText = cafeObj.name
            cafeAddress.innerText = cafeObj.address
            cafeImgContainer.innerHTML = ''
            cafeObj.image.forEach((storedCafeImg) => {
                let cafeImg = document.createElement("img")
                cafeImg.src = storedCafeImg
                cafeImgContainer.append(cafeImg)
            })
            cafeReviewUL.innerHTML = ''
            cafeObj.reviews.forEach((storedCafeReviewObj) => {
                let cafeReviewLI = document.createElement("li")
                let reviewText = document.createElement("p")
                reviewText.innerText = storedCafeReviewObj.userReview
                let reviewHeartRating = document.createElement("span")
                reviewHeartRating.innerText = storedCafeReviewObj.userRating
                let reviewImg = document.createElement("img")
                reviewImg.src = storedCafeReviewObj.userImage
                cafeReviewLI.append(reviewText, reviewHeartRating, reviewImg)
                cafeReviewUL.append(cafeReviewLI)
            })
        })

    leaveReviewForm.addEventListener("submit", (evt) => {
        evt.preventDefault()
        let userReviewInput = evt.target.reviewInput.value
        let newReviewArr = displayedCafe.reviews
        newReviewArr.push(userReviewInput)
        fetch("http://localhost:3000/cafes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reviews: newReviewArr 
            })
        })
            .then(resp => resp.json())
            .then((updatedCafeObj) => {
                console.log(updatedCafeObj.reviews)
            })
    })

})