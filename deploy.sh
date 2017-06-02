#!/bin/bash
webpack
scp -P22 ./local/dir username@servername.com:/remote/dir 
