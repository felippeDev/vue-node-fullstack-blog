<template>
  <div>
    <header>
      <!-- Fixed navbar -->
      <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <a class="navbar-brand" href="#">ReliableNews.com</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="#">Posts <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">About</a>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" href="#">Admin</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main role="main" class="container">
      <!-- Add New Post -->
      <div class="row" style="margin: 10px;">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header">
              <h3>Create or Edit a post</h3>
            </div>
            <div class="card-body">
              <form>
                <div class="form-group">
                  <label for="exampleFormControlInput1">Post Id</label>
                  <input v-model="formPost.id" type="text" class="form-control" id="postIdForm" placeholder="Post id (auto generated)" disabled>
                </div>
                <div class="form-group">
                  <label for="exampleFormControlInput1">Post Title</label>
                  <input v-model="formPost.title" type="text" class="form-control" id="postTitleForm" placeholder="Post Title" required>
                </div>              
                <div class="form-group">
                  <label for="exampleFormControlInput1">Post Image Source</label>
                  <input v-model="formPost.image" type="text" class="form-control" id="postImageSourceForm" placeholder="Post Image Source" required>
                </div>              
                <div class="form-group">
                  <label for="exampleFormControlInput1">Post Description</label>
                  <input v-model="formPost.description" type="text" class="form-control" id="postDescriptionForm" placeholder="Post Description" required>
                </div>
                <div class="form-group">
                  <label for="exampleFormControlInput1">Post Content</label>
                  <input v-model="formPost.content" type="text" class="form-control" id="postContentForm" placeholder="Post Content" required>
                </div>
                <div class="row">
                  <div class="col-md-10 text-left">
                    <button :disabled='!formPostValid' type="button" class="btn btn-primary" v-on:click="savePost(formPost)">Save</button>
                  </div>
                  <div class="col-md-2 text-right">
                    <button type="button" class="btn btn-muted" v-on:click="resetFormPost()"><span class="fa fa-close"></span> Clear</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Post Search -->
      <div class="row" style="margin: 10px;">
        <div class="col-md-12">
            <form>
              <div class="form-group">
                <label for="filterPost"><span class="fa fa-search"></span> Search</label>
                <input v-model="filterPost" type="text" class="form-control" id="filterPost" aria-describedby="Enter your search term" placeholder="Enter your search term">
              </div>
            </form>
        </div>
      </div>

      <!-- Posts List -->
      <div class="row">
        <div class="col-md-12">
          <ul class="list-group list-group-flush">
            <li class="post-item" style="margin:10px;" v-for="post in filteredPosts" v-bind:key="post.id">
              <div class="card">
                <div class="card-header">                  
                  <!-- Post Title -->
                  <h3>{{ post.title }}</h3>
                </div>
                <div class="card-body">
                  <img class="post-image" v-bind:src="post.image" v-bind:alt="post.title"/>
                  <!-- Post id -->
                  <p>Id: <strong>{{ post.id }}</strong></p>
                  <p class="lead"></p>
                  <!-- Post Short description -->
                  <p>Description:</p>
                  <p class="lead">{{ post.description }}</p>
                  <!-- Post Short description -->
                  <p>Content:</p>
                  <p class="lead">{{ post.content }}</p>
                  <!-- Post Links -->
                  <div class="row">
                    <div class="col-md">
                      <button class="btn btn-secondary">Continue reading</button>
                    </div>
                    <div class="col-md text-right">
                      <button class="btn btn-secondary" v-on:click="formPost = post"><span class="fa fa-edit"></span></button>
                      &nbsp;
                      <button class="btn btn-danger" v-on:click="deletePost(post)"><span class="fa fa-trash"></span></button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <span class="text-muted">ReliableNews.com - All rights reserved</span>
      </div>
    </footer>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css"
import "font-awesome/css/font-awesome.css"
import "bootstrap/dist/js/bootstrap.js"
import axios from 'axios/dist/axios.js';

export default {
  name: "app",
  data: function(){
    return {
      formPost: {
        id: 0,
        title: "",
        image: "",
        description: "",
        content: ""
      },
      filterPost: "",
      post: {
        id: 0,
        title: "",
        image: "",
        description: "",
        content: ""
      },
      posts: []
    };
  },
  methods: {
    savePost(formPost) {
			axios({
				url: 'http://localhost:4000',
				method: 'post',
				data: {
					query: `
						mutation ($formPost: PostInput) {
							post: savePost (post: $formPost) {
                id
								title
                image
                description
								content
							}
						}
					`,
					variables: {
						formPost
					}
				}
			}).then(response => {
        const body = response.data;
        const query = body.data;
        const result = query.post;
        
        console.log('post saved ' + JSON.stringify(result));

        // Updating view data
        let existingPost = this.posts.find(post => post.id === result.id);
        if(!existingPost) {
          this.posts.push(result);
        }
        existingPost = result;
        this.resetFormPost();
      });
    },
    deletePost(formPost) {
      axios({
				url: 'http://localhost:4000',
				method: 'post',
				data: {
					query: `
						mutation ($formPost: PostInput) {
							post: deletePost (post: $formPost) {
                id
								title
                image
                description
								content
							}
						}
					`,
					variables: {
						formPost
					}
				}
			}).then(response => {
        const body = response.data;
        const query = body.data;
        const result = query.post;

        console.log('post removed ' + JSON.stringify(result));
        
        // Updating view data
        const existingPost = this.posts.find(post => post.id === result.id);
        if(existingPost) {
          this.posts.splice(this.posts.indexOf(existingPost, 1));
        }
      });
    },
    resetFormPost() {
      this.formPost.id = 0;
      this.formPost.title = "";
      this.formPost.image = "";
      this.formPost.description = "";
      this.formPost.content = "";
      
      console.log('form reset');
    }
  },
  computed: {
    filteredPosts() {
      if(!this.filterPost) return this.posts;
      return this.posts.filter(post => post.title.toUpperCase().includes(this.filterPost.toUpperCase()));
    },
    formPostValid() {
      return this.formPost.title && this.formPost.image && this.formPost.description && this.formPost.content; 
    }
  },
  created() {
    axios({
      url: "http://localhost:4000",
      method: "POST",
      data: {
        query: `
          {
            posts {
              id
              title
              image
              description
              content
            }
          }
        `
      }
    }).then(response => {
      const body = response.data;
      const query = body.data;

      // Updating view data
      this.posts = query.posts;
    });
  }
};
</script>

<style>
html {
  position: relative;
  min-height: 100%;
}

body {
  /* Margin bottom by footer height */
  margin-bottom: 60px;
  background-color: #f1f1f1;
}

main {
  margin-top: 5em;
  margin-bottom: 5em;
}

li.post-item {
  list-style: none;
}

.post-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  object-position: 100% 18%;
  margin-bottom: 20px;
  padding: 0;
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;

  /* Set the fixed height of the footer here */
  height: 60px;
  line-height: 60px; /* Vertically center the text there */
  background-color: #f9f9f9;
  border-top: 1px solid #ccc;
}
</style>
