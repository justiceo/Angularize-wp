
Contributing guidelines (for code)
----------------------------------

Forking and Pull Requests on Angularize-wp
--------------------------------------
1. On GitHub, navigate to the justiceo/Angularize-wp repository.
2. In the top-right corner of the page, click *Fork*.

That's it! Now, you have a fork of the original justiceo/Angularize-wp as <your_username>/Angularize_wp repository.

In order to propose changes to the upstream, or original, Angularize-wp repository, it is good practice to regularly sync your fork with the upstream repository. To do this, you'll need to use Git on the command line. 

Set up Git
----------------
If you haven't yet, you should first set up Git https://help.github.com/articles/set-up-git 

Create a local clone of your fork
---------------------------------
Right now, you have a fork of the Angularize-wp repository, but you don't have the files in that repository on your computer. Let's create a clone of your fork locally on your computer.
Open the terminal and run
```
$ git clone https://github.com/YOUR-USERNAME/Angularize-wp
```
Now you have a local copy of the Angularize-wp repository


Configure Git to sync your fork with upstream repository
--------------------------------------------
Type `git remote -v` and press *Enter*. You'll see the current configured remote repository for your fork.
```
git remote -v
origin  https://github.com/YOUR_USERNAME/Angularize-wp.git (fetch)
origin  https://github.com/YOUR_USERNAME/Angularize-wp.git (push)
```
To add the upstream repository, type
```
git remote add upstream https://github.com/justiceo/Angularize-wp.git
```

To verify the new upstream repository you've specified for your fork, type git remote -v again. You should see the URL for your fork as origin, and the URL for the original repository as upstream.
```
git remote -v
origin  https://github.com/YOUR_USERNAME/Angularize-wp.git (fetch)
origin  https://github.com/YOUR_USERNAME/Angularize-wp.git (push)
upstream  https://github.com/justiceo/Angularize-wp.git (fetch)
upstream  https://github.com/justiceo/Angularize-wp.git (push)
```

Next, fetch the branches and their respective commits from the upstream repository. Commits to master will be stored in a local branch, upstream/master.
```
git fetch upstream
remote: Counting objects: 75, done.
remote: Compressing objects: 100% (53/53), done.
remote: Total 62 (delta 27), reused 44 (delta 9)
Unpacking objects: 100% (62/62), done.
From https://github.com/justiceo/Angularize-wp
 * [new branch]      master     -> upstream/master
```

Creating the *Dev* branch
-----------------------------
Branches allow you to build new features or test out ideas without putting your main project at risk. The main work in done on the dev branch and merged into the master branch. 
With the terminal open, navigate to the local Angularize project directory and type:
```
git checkout dev
Switched to new branch 'dev'
Your branch is setup to track 'origin/dev'
```

Merging newer updates from upstream
----------------------------------------
Between the last time you fetched updates from upstream and did work, there could have been newer updates (or commits) on the upstream dev branch. To merge the latest changes into your local copy, execute in the terminal:
```
$ git merge upstream/dev
```

Opening a pull request
---------------------------
To experiment with pull requests, while still in the *dev* branch, modify this document by Adding your name to the list of contributors at the bottom of this file.
```
# create a commit for the change
$ git commit -am "added my name to the contributor list"
$ git push origin dev
```
Now visit your repo page at https://github.com/YOUR-USERNAME/Angularize-wp to see the latest commit - and the alluring bright green "Compare and Pull request". Click on the button, select from origin `dev` to upstream `dev`

Contributors List
-----------------
* Justice Ogbonna (@justiceo)
* Emil Kitua (@emilkitua)


For more information on forking and contributing see:
---------------
* https://help.github.com/articles/fork-a-repo/
* https://help.github.com/articles/creating-a-pull-request-from-a-fork/
