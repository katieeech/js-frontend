document.addEventListener("DOMContentLoaded", (e) => {
    //stable elements
    let cafeName = document.querySelector(".cafe-name")
    let cafeAddress = document.querySelector(".cafe-address")
    let cafeImgContainer = document.querySelector(".cafe-image-container")
    let cafeAvgHeartContainer = document.querySelector(".avg-cafe-hearts")
    let leaveReviewForm = document.querySelector(".review-form")
    let reviewTextarea = document.querySelector(".review-form > textarea")
    let cafeReviewUL = document.querySelector(".reviews")
    let displayedCafe = {}


    //Make a GET fetch
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


    //Adding an Event Listener on leaveReviewForm
    leaveReviewForm.addEventListener("submit", (evt) => {
        evt.preventDefault()
        let userReviewInputString = reviewTextarea.value

        let newReviewArr = displayedCafe.reviews

        let lastObj = displayedCafe.reviews[displayedCafe.reviews.length - 1]

        let lastId = lastObj.userId

        let userReviewInputObj = {
            userId: lastId + 1,
            userReview: userReviewInputString,
            userRating: 5,
            userImage: "https://s3-media0.fl.yelpcdn.com/bphoto/yF67XONxES0imLkXaqJnGg/o.jpg"
        }

        newReviewArr.push(userReviewInputObj)

        //Make a PATCH fetch request
        fetch("http://localhost:3000/cafes/1", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reviews: newReviewArr
            })
        })
            .then(resp => resp.json())
            .then((updatedCafeObj) => {
                // Update the DOM

                let cafeReviewLI = document.createElement("li")
                let reviewText = document.createElement("p")
                reviewText.innerText = userReviewInputString
                let reviewHeartRating = document.createElement("span")
                reviewHeartRating.innerText = updatedCafeObj.reviews[updatedCafeObj.reviews.length - 1].userRating
                let reviewImg = document.createElement("img")
                reviewImg.src = updatedCafeObj.reviews[updatedCafeObj.reviews.length - 1].userImage
                let reviewEditBtn = document.createElement("button")
                reviewEditBtn.innerText = "Edit"
                cafeReviewLI.append(reviewText, reviewHeartRating, reviewImg, reviewEditBtn)
                cafeReviewUL.append(cafeReviewLI)

                //Update the Object in Memory
                displayedCafe = updatedCafeObj

                //Adding an Event Listener on reviewEditBtn
                reviewEditBtn.addEventListener("click", (evt) => {
                    let reviewNewEditForm = document.createElement("form")

                    let reviewNewTextarea = document.createElement("textarea")
                    reviewNewTextarea.innerText = "Edit your review here!"
                    let reviewNewSubmitInput = document.createElement("input")
                    reviewNewSubmitInput.type = "submit"
                    reviewNewSubmitInput.value = "Submit"
                    reviewNewSubmitInput.name = "newReviewInput"

                    reviewNewEditForm.append(reviewNewTextarea, reviewNewSubmitInput)
                    cafeReviewLI.append(reviewNewEditForm)


                    //Adding an Event Listener on reviewEditForm (submit button)
                    reviewNewEditForm.addEventListener("submit", (evt) => {
                        evt.preventDefault()

                        let userReviewNewInputString = reviewNewTextarea.value
                        let editedNewReview = displayedCafe.reviews[displayedCafe.reviews.length - 1].userReview
                        editedNewReview = userReviewNewInputString
                        let originalReviewArr = displayedCafe.reviews

                        let userReviewInputObj = {
                            userId: displayedCafe.reviews[displayedCafe.reviews.length - 1].userId,
                            userReview: editedNewReview,
                            userRating: displayedCafe.reviews[displayedCafe.reviews.length - 1].userRating,
                            userImage: displayedCafe.reviews[displayedCafe.reviews.length - 1].userImage
                        }

                        originalReviewArr[originalReviewArr.length - 1] = userReviewInputObj

                        fetch("http://localhost:3000/cafes/1", {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                reviews: originalReviewArr
                            })
                        })
                            .then(resp => resp.json())
                            .then((updatedCafeWithReview) => {
                                //Update the DOM
                                reviewText.innerText = updatedCafeWithReview.reviews[updatedCafeWithReview.reviews.length - 1].userReview
                                //Update the Object in Memory
                                displayedCafe = updatedCafeWithReview
                            })
                        evt.target.reset()
                    })

                })
            })

    })


})