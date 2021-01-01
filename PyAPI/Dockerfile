FROM python:3.7

ADD wheelhouse /app/wheelhouse

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

RUN apt-get install --yes --no-install-recommends  curl gnupg unixodbc-dev

RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
 && curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list  \
 && apt-get update \
 && ACCEPT_EULA=Y apt-get install  --yes --no-install-recommends msodbcsql17 \
 && ACCEPT_EULA=Y apt-get install  --yes --no-install-recommends mssql-tools

RUN echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bash_profile \
 && echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc \
 && /bin/bash -c "source ~/.bashrc"

RUN apt-get install --yes --no-install-recommends  unixodbc-dev \
 && apt-get install --yes --no-install-recommends  libgssapi-krb5-2


ADD requirements.txt /app/requirements.txt

RUN ln -s /usr/include/locale.h /usr/include/xlocale.h  && \
    pip3 install --no-index -r app/requirements.txt --find-links=app/wheelhouse && \
    rm -rf /var/cache/apk/*

ADD . /app
WORKDIR /app

ENTRYPOINT ["python"]
CMD ["main.py"]
