# 1 - Define base image
FROM python:3.6

# 2 - Run apt update
RUN apt-get update

# 3 - Install some needed packages
RUN apt-get install -y python3-dev gcc

# 4 - Copy the requirements.txt to Docker container
COPY requirements.txt requirements.txt

# 5 - Install some needed packages for the project
RUN pip install -r requirements.txt

# 5 - Install tensorflow (no AVX - CPU)
COPY tensorflow-1.14.1-cp36-cp36m-linux_x86_64.whl tensorflow-1.14.1-cp36-cp36m-linux_x86_64.whl
RUN pip3 install tensorflow-1.14.1-cp36-cp36m-linux_x86_64.whl

# 6 - Install transformers - Do not update this dependency, it will break the model
RUN pip3 install transformers===2.2.2

# 7 - Copy whole project to Docker container
COPY . /app

# 8 - Set environment to use port 443
ENV PORT 443

# 9 - Expose port 443 to bind to later on
EXPOSE 443

# 10 - Define the working directory
WORKDIR /app

# 11 - Set entrypoint to Python
ENTRYPOINT [ "python3.6" ]

# 12 - Launch app.py in command line
CMD [ "app.py" ]
