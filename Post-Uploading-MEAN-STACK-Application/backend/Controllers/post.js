const Post  = require('../models/post')

exports.createPost = (req,res,next) => {
    const url = req.protocol + '://' + req.get("host");
     const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
     });
    
     post.save().then(createPost => {
        res.status(201).json({
           message:"Post added sucessfully!!",
           post :{
              ...createPost,
              id: createPost._id,
             //  title: createPost.title,
             //  content: createPost.content,
             //  imagePath: createPost.imagePath
           }
        })
     }).catch(error => {
        res.status(500).json({
           message:'Creating a post failed!!'
        })
     });
     res.status(201).json({
        message:'Post added successfully!'
     })
  }

  exports.updatePost =  (req,res,next) => {
    let imagePath = req.body.imagePath;
    if(req.file){
       const url = req.protocol + "://" + req.get("host");
       imagePath = url + "/images" + req.file.filename
    }
    const post = new Post({
       _id: req.body.id,
       title: req.body.title,
       content: req.body.content,
       imagePath: req.body.imagePath,
       creator: req.userData.userId
    });
   //  console.log(req.userData)
   //  return res.status(200).json({})
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId} , post)
    .then(result => {
       if(result.n > 0){
         res.status(200).json({
            message:'Update successfully!!',
         });
       }
       else{
          res.status(401).json({
             message: "Not authorized!!"
          })
       }
    }).catch(error => {
       res.status(500).json({
          message: "Coudnt update post!!"
       })
    });
  
 }

 exports.getPost =  (req,res,next) => {
    const postSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery= Post.find();
    let fetchedPosts;
    if(postSize && currentPage){
       postQuery
        .skip(postSize * (currentPage - 1 ))
        .limit(postSize);
    }
     postQuery.then(documents => {
        fetchedPosts = documents;
       return Post.count();
     }).then(count => {
        res.status(200).json({
           message:"POsts fetched successfully",
           posts: fetchedPosts,
           maxPosts: count
        })
     }).catch(error => {
        res.status(500).json({
           message:"Fetching post failed!!"
        })
     });
 }

 exports.getfetchPost = (req,res,next) => {
    Post.findById(req.params.id).then(post => {
      // console.log(post)
       if(post){
          res.status(200).json(post);
       }
       else{
          res.status(404).json({
             message:'Post not found'
          });
       }
    }).catch(error => {
      res.status(500).json({
         message:"Fetching post failed!!"
      })
   });
 }

 exports.deletePost = (req,res,next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
      if(result.n > 0){
         res.status(200).json({
            message:'Delete successfully!!',
         });
       }
       else{
          res.status(401).json({
             message: "Not authorized!!"
          })
       }
    }).catch(error => {
      res.status(500).json({
         message:"Delete  post failed!!"
      })
   }) ;
    
   
 }