document.addEventListener("DOMContentLoaded", (e) => {
    //stable elements
    // let cafeTopPageDiv = document.querySelector(".cafeTopPageDiv")
    // console.log(cafeTopPageDiv)
    let cafeName = document.querySelector(".cafe-name")
    let cafeAddress = document.querySelector(".cafe-address")
    let cafeImgContainer = document.querySelector(".cafe-image-container")
    // let cafeAvgHeartContainer = document.querySelector(".avg-cafe-hearts")
    let heartBtns = document.querySelector(".btn-heart-rating")
    let allRatingArr = []
    let avgRating = 0
    let leaveReviewForm = document.querySelector(".review-form")
    let reviewTextarea = document.querySelector(".review-form > textarea")
    let reviewImgInput = document.querySelector("#url")
    let cafeReviewUL = document.querySelector(".reviews")
    let displayedCafe = {}


    //Helper function for heart rating
    function getReviewerHeart(storedAvg) {
        storedAvg = parseInt(storedAvg)
        console.log(storedAvg)
        if (storedAvg === 1) {
            document.querySelector(".btn1").style.color = "white";
            // document.querySelector(".btn1").style.color = "white";
        } else if (storedAvg === 2) {
            document.querySelector(".btn1").style.color = "white";
            document.querySelector(".btn2").style.color = "white";
        } else if (storedAvg === 3) {
            document.querySelector(".btn1").style.color = "white";
            document.querySelector(".btn2").style.color = "white";
            document.querySelector(".btn3").style.color = "white";
        } else if (storedAvg === 4) {
            document.querySelector(".btn1").style.color = "white";
            document.querySelector(".btn2").style.color = "white";
            document.querySelector(".btn3").style.color = "white";
            document.querySelector(".btn4").style.color = "white";
        } else if (storedAvg === 5) {
            document.querySelector(".btn1").style.color = "white";
            document.querySelector(".btn2").style.color = "white";
            document.querySelector(".btn3").style.color = "white";
            document.querySelector(".btn4").style.color = "white";
            document.querySelector(".btn5").style.color = "white";
        }
    }




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
                let reviewHeartRating = document.createElement("div")

                function getReviewHeart(reviewerHeart) {

                    if (reviewerHeart === 1) {
                        reviewHeartRating.innerText = "❤️";
                    } else if (reviewerHeart === 2) {
                        reviewHeartRating.innerText = "❤️ ❤️";
                    } else if (reviewerHeart === 3) {
                        reviewHeartRating.innerText = "❤️ ❤️ ❤️";
                    } else if (reviewerHeart === 4) {
                        reviewHeartRating.innerText = "❤️ ❤️ ❤️ ❤️";
                    } else if (reviewerHeart === 5) {
                        reviewHeartRating.innerText = "❤️ ❤️ ❤️ ❤️ ❤️";
                    }
                }

                getReviewHeart(storedCafeReviewObj.userRating)

                let reviewImg = document.createElement("img")
                reviewImg.src = storedCafeReviewObj.userImage

                allRatingArr.push(parseInt(storedCafeReviewObj.userRating))

                cafeReviewLI.append(reviewHeartRating, reviewText, reviewImg)
                cafeReviewUL.append(cafeReviewLI)

            })

            allRatingArr.forEach((rating) => {
                avgRating = avgRating + rating
            })
            // console.log(allRatingArr)
            // console.log(allRatingArr.length)
            avgRating = avgRating / allRatingArr.length
            console.log(`Inside Get fetch: ${avgRating}`)
            getReviewerHeart(avgRating)



        }) //closing second .then()


    console.log(`Global: ${avgRating}`)



    //Adding an Event Listener on leaveReviewForm
    leaveReviewForm.addEventListener("submit", (evt) => {
        evt.preventDefault()
        let userReviewInputString = reviewTextarea.value

        let userReviewinputIMG = reviewImgInput.value

        let newReviewArr = displayedCafe.reviews

        let lastObj = displayedCafe.reviews[displayedCafe.reviews.length - 1]

        let lastId = lastObj.userId



        //Function for heart rating.
        let checkValue = ''
        function getHeart() {
            let radios = document.getElementsByName("user-heart");
            // console.log(radios)
            for (let i = 0, length = radios.length; i < length; i++) {
                if (radios[i].checked) {
                    return parseInt(radios[i].value);
                    // only one radio can be logically checked, don't check the rest
                    // break;
                }
            }
        } //closing the function

        checkValue = getHeart()


        let userReviewInputObj = {
            userId: lastId + 1,
            userReview: userReviewInputString,
            userRating: checkValue,
            userImage: userReviewinputIMG
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
                let reviewHeartRating = document.createElement("div")

                // reviewHeartRating.innerText = updatedCafeObj.reviews[updatedCafeObj.reviews.length - 1].userRating

                function getReviewHeart(reviewerUpdatedHeart) {
                    // reviewerUpdatedHeart = parseInt(reviewerUpdatedHeart)
                    if (reviewerUpdatedHeart === 1) {
                        // reviewHeartRating.innerText = "testing here"
                        reviewHeartRating.innerText = "❤️";
                    } else if (reviewerUpdatedHeart === 2) {
                        reviewHeartRating.innerText = "❤️ ❤️";
                    } else if (reviewerUpdatedHeart === 3) {
                        reviewHeartRating.innerText = "❤️ ❤️ ❤️";
                    } else if (reviewerUpdatedHeart === 4) {
                        reviewHeartRating.innerText = "❤️ ❤️ ❤️ ❤️";
                    } else if (reviewerUpdatedHeart === 5) {
                        reviewHeartRating.innerText = "❤️ ❤️ ❤️ ❤️ ❤️";
                    }
                }

                console.log(updatedCafeObj.reviews[updatedCafeObj.reviews.length - 1].userRating) //2
                getReviewHeart(updatedCafeObj.reviews[updatedCafeObj.reviews.length - 1].userRating)
                console.log(reviewHeartRating.innerText)

                let reviewImg = document.createElement("img")
                reviewImg.src = updatedCafeObj.reviews[updatedCafeObj.reviews.length - 1].userImage
                let reviewEditBtn = document.createElement("button")
                reviewEditBtn.innerText = "Edit"
                let reviewDeleteBtn = document.createElement("button")
                reviewDeleteBtn.innerText = "Delete"
                allRatingArr.push(parseInt(updatedCafeObj.reviews[updatedCafeObj.reviews.length - 1].userRating))

                // avgRatingNewTotal = (avgRating * (allRatingArr.length - 1)) + allRatingArr[allRatingArr.length - 1]
                // avgRating = avgRatingNewTotal / allRatingArr[allRatingArr.length - 1]


                avgRating = 0;
                allRatingArr.forEach((heartrating) => {
                    avgRating = avgRating + heartrating
                })
                avgRating = avgRating / allRatingArr.length


                // console.log(`Inside patch Length: ${allRatingArr.length}`)
                // console.log(`Inside patch avgRating: ${avgRating}`) //1
                document.querySelector(".btn1").style.color = "transparent";
                document.querySelector(".btn2").style.color = "transparent";
                document.querySelector(".btn3").style.color = "transparent";
                document.querySelector(".btn4").style.color = "transparent";
                document.querySelector(".btn5").style.color = "transparent";


                getReviewerHeart(avgRating)
                console.log(`inside patch: ${avgRating}`)

                cafeReviewLI.append(reviewHeartRating, reviewText, reviewImg, reviewEditBtn, reviewDeleteBtn)
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
                reviewDeleteBtn.addEventListener("click", (evn) => {
                    let newRevArr = displayedCafe.reviews.slice(0, -1)
                    console.log(cafeReviewUL.lastChild)
                    fetch("http://localhost:3000/cafes/1", {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            reviews: newRevArr
                        })
                    })
                        .then(resp => resp.json())
                        .then((newCafeObj) => {
                            // Update the DOM
                            reviewDeleteBtn.parentNode.remove()
                            // let lastReview = cafeReviewUL.lastElementChild
                            // lastReview.remove() 
                            //Update the Object in Memory
                            displayedCafe = newCafeObj
                        })



                })

            })
        console.log(`Second Global: ${avgRating}`)

        evt.target.reset()
    }) //closing Global event listener



    console.log(`Third Global: ${avgRating}`)



})




