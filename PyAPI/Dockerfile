FROM python:3.7

#Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        openssh-server \
        vim \
        curl \
        wget \
        apt-transport-https \
        tcptraceroute \
        bash \
    && pip install --upgrade pip

RUN apt-get install --yes --no-install-recommends  curl gnupg

ADD requirements.txt /app/requirements.txt

RUN ln -s /usr/include/locale.h /usr/include/xlocale.h  && \
    pip3 install -r app/requirements.txt && \
    rm -rf /var/cache/apk/*

ADD . /app
WORKDIR /app

RUN python setup.py build_ext --inplace

ENTRYPOINT ["python"]
CMD ["main.py"]
