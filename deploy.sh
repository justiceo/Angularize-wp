#!/bin/bash
webpack
scp -P 22 username@servername.com:/remote/dir ./local/dir
