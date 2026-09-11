# A cat recognizer works wrong in which pictures?
> 2018-03-01 23:33:51

I took a break from my busy schedule and finished the first DL course on Coursera in a few days.

Although it took almost 10 months to learn ML before, it has been a year, and there is really not much I can remember.

The Project of this course is very interesting, a Cat Recognizer.

Andrew Ng said that deep learning and Cat are inseparable, so our Programming Assignment is it, a Cat Recognizer!

# Dataset

In the fourth week, the Project completed the entire Neural Network, L-layer Neural Network, 209 training samples, and 50 test samples which each sample is a 64\*64 image, imported in h5 format

The image vectorization process is as follow:

![img](/src/articles/Blogs/DeepLearning/images/20180301220156553.png)

# L-Layer Neural Network

The Architecture is as follow:

![img](/src/articles/Blogs/DeepLearning/images/20180301233124903.png)

Compared with the **100%** accuracy on training data and **72%** accuracy on test data of the 2-layer shallow neural network, the L-layer reduces overfitting on the training data and only achieves **98.56%** accuracy. But the accuracy on test data has risen to **80%**.

Which means, 10 of the 50 images in the test data are classified incorrectly, and the recognition rate of the entire network is relatively poor.

However, the ReLU and Sigmoid functions used by the activation function are relatively simple activation functions, and it is very good to achieve this accuracy.

# Incorrectly classified images

The final optional assignment is still to add my own pictures for test, so I found a few interesting pictures to try to confuse the neural network. As far as these pictures, even people can not define that they are cats or not (≖ᴗ≖)✧.

- 1st: A character in FGO game
  
  ![img](/src/articles/Blogs/DeepLearning/images/20180301221152337.png)

Prediction:

![img](/src/articles/Blogs/DeepLearning/images/20180301221312224.png)

- 2nd: Still this character but with different clothes

  ![img](/src/articles/Blogs/DeepLearning/images/20180301221332174.png)

Prediction:

![img](/src/articles/Blogs/DeepLearning/images/20180301221437181.png)

- 3rd: Still this character but with different clothes 

  ![img](/src/articles/Blogs/DeepLearning/images/2018030122151042.png)

  **Here comes the strange result, the neural network thinks this one is a cat, and the first two are not ( • ̀ω•́ )✧**

Prediction:

  ![img](/src/articles/Blogs/DeepLearning/images/20180301221627606.png)

- 4th: A Tigger

  ![img](/src/articles/Blogs/DeepLearning/images/2018030122171696.png)

Prediction: no trick

  ![img](/src/articles/Blogs/DeepLearning/images/20180301221736914.png)

- 5th: A little tigger

  ![img](/src/articles/Blogs/DeepLearning/images/20180301221815865.png)
  
Prediction: tricked (~・ｖ・)~

  ![img](/src/articles/Blogs/DeepLearning/images/20180301221828200.png)

- 6th: A little lion (panther?)

  ![img](/src/articles/Blogs/DeepLearning/images/20180301221958512.png)

Prediction: tricked.

  ![img](/src/articles/Blogs/DeepLearning/images/20180301222049830.png)

- 7th: A cat-shaped plush toy

  ![img](/src/articles/Blogs/DeepLearning/images/20180301222154795.png)

Prediction: tricked

  ![img](/src/articles/Blogs/DeepLearning/images/20180301222211549.png)

- 8th: A lovely cat

  ![img](/src/articles/Blogs/DeepLearning/images/20180301232140299.png)

Prediction: Haha, this picture is missing the most important feature of a cat, the ears, so NN thinks it's not a cat (funny

  ![img](/src/articles/Blogs/DeepLearning/images/20180301232311484.png)

# Conclusion

Although I didn't look at the 209 training data, I can probably guess some important features. Of course, the features I pointed out are based on our vision.

- whether the picture has **cat ears**
- whether the picture has **cat furry claws**
- The **animal face** of the picture

Considering that several cat pictures in the test data are also identified incorrectly, **the background of similar color to the cat** will lead to the classification error, and the overall color of the picture will also affect the recognition result.

If you have more interesting pictures that you want to try, you can leave pictures in the comments.
