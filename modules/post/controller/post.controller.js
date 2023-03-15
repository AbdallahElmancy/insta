const postModel = require("../../../DB/post.model");
const userModel = require("../../../DB/user.model");
const sendEmail = require("../../../common/email");

const addPost = async (req, res) => {
  try {
    let { desc, title, tagsLink } = req.body;
    let allPics = [];

    if (req.files.lenght > 0 || req.files) {
      for (let index = 0; index < req.files.length; index++) {
        let imageURL = `${req.protocol}://${req.headers.host}/${req.files[index].path}`;
        allPics.push(imageURL);
      }
    }

    let tagedEmail = "";
    let validId = [];
    if (tagsLink.length) {
      for (let index = 0; index < tagsLink.length; index++) {
        let findUser = await userModel.findOne({ _id: tagsLink[index] });
        if (findUser) {
          validId.push(tagsLink[index]);
          if (tagedEmail.length) {
            tagedEmail = tagedEmail + "," + findUser.email;
          } else {
            tagedEmail = findUser.email;
          }
        }
      }
    }

    let addPost = new postModel({
      desc,
      title,
      tags: validId,
      images: allPics,
    });
    let add = await addPost.save();
    res.status(200).json({ massage: "done", add });
  } catch (error) {
    res.status(400).json({ massage: "server error", error });
  }
};

const likePost = async (req, res) => {
  try {
    let { id } = req.params;
    let post = await postModel.findById(id);
    if (post) {
      let userLiked = post.likes.find((ele) => {
        return ele.toString() === req.user._id.toString();
      });
      if (userLiked) {
        res.status(404).json({ massage: "user already like" });
      } else {
        post.likes.push(req.user._id);
        let updateLike = await postModel.findByIdAndUpdate(
          id,
          { likes: post.likes },
          { new: true }
        );
        res
          .status(200)
          .json({ massage: " you maked like in post", updateLike });
      }
    } else {
      res.status(404).json({ massage: "post is not found" });
    }
  } catch (error) {
    res.status(400).json({ massage: "server error", error });
  }
};
const disLikes = async (req, res) => {
  try {
    let { id } = req.params;
    let post = await postModel.findById(id);
    if (post) {
      let userLiked = post.likes.find((ele) => {
        return ele.toString() === req.user._id.toString();
      });
      if (userLiked) {
        let deleteLike = post.likes.find((ele) => {
          return ele.toString() !== req.user._id.toString();
        });
        if (deleteLike == undefined || deleteLike.length > 1) {
          let updateLike = await postModel.findByIdAndUpdate(
            id,
            { likes: [] },
            { new: true }
          );
          res
            .status(200)
            .json({ massage: " you maked dislike in post", updateLike });
        } else {
          let updateLike = await postModel.findByIdAndUpdate(
            id,
            { likes: deleteLike },
            { new: true }
          );
          res
            .status(200)
            .json({ massage: " you maked dislike in post", updateLike });
        }
      } else {
        res.status(404).json({ massage: "user already dislike" });
      }
    } else {
      res.status(404).json({ massage: "post is not found" });
    }
  } catch (error) {
    res.status(500).json({ massage: "server error", error });
  }
};

const createComments = async (req, res) => {
 try {
  let { id } = req.params;
  let { desc, tags } = req.body;

  let allPics = [];
  if (req.files.lenght > 0 || req.files) {
    for (let index = 0; index < req.files.length; index++) {
      let imageURL = `${req.protocol}://${req.headers.host}/${req.files[index].path}`;
      allPics.push(imageURL);
    }
  }

  let tagedEmail = "";
  let validId = [];
  if (tags.length > 0) {
    for (let index = 0; index < tags.length; index++) {
      let findUser = await userModel.findOne({ _id: tags[index] });
      if (findUser) {
        validId.push(tags[index]);
        if (tagedEmail.length) {
          tagedEmail = tagedEmail + "," + findUser.email;
        } else {
          tagedEmail = findUser.email;
        }
      }
    }
  }

  if (tagedEmail != "") {
    sendEmail(
      tagedEmail,
      `<h2>you are taged in a comment</h2>
      <br/>
      <a href='${req.protocol}://${req.headers.host}/post/${id}'> click here to view the post </a>
      `,
      []
    );
  }

  let post = await postModel.findOne({_id:id})
  if(post){
    post.comments.push({desc,tags:tags,images:allPics,userId:req.user._id})
    let update = await postModel.findByIdAndUpdate(post._id,{comments:post.comments},{new:true})
    res.status(202).json({massage:"updated",update})
  }else{
    res.status(404).json({massage:"post is  lost"})

  }
 } catch (error) {
  res.status(500).json({ massage: "server error", error });

 }
};

const getOnePost = async (req, res) => {
  try {
    let { id } = req.params;
    if (!id) {
      res.status(404).json({ massage: "invalied id" });
    } else {
      let foundPost = await postModel.findById(id);
      if (foundPost) {
        res.status(202).json({ massage: "post", foundPost });
      } else {
        res.status(404).json({ massage: "the post is missing" });
      }
    }
  } catch (error) {
    res.status(500).json({ massage: "server error", error });
  }
};

module.exports = { addPost, likePost, disLikes, createComments, getOnePost };
