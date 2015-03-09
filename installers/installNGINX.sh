#!/bin/bash
apt-get -y install build-essential zlib1g-dev libpcre3 libpcre3-dev libbz2-dev libssl-dev tar unzip
mkdir -p src && cd src
nginxVersion="1.6.2"
NPS_VERSION=1.9.32.3
wget http://nginx.org/download/nginx-$nginxVersion.tar.gz
wget https://github.com/pagespeed/ngx_pagespeed/archive/release-${NPS_VERSION}-beta.zip
tar -xzf nginx-$nginxVersion.tar.gz 
unzip release-${NPS_VERSION}-beta.zip
cd ngx_pagespeed-release-${NPS_VERSION}-beta/
wget https://dl.google.com/dl/page-speed/psol/${NPS_VERSION}.tar.gz
tar -xzvf ${NPS_VERSION}.tar.gz  # extracts to psol/
cd ..
cd nginx-$nginxVersion
./configure --user=nginx --group=nginx --prefix=/etc/nginx --sbin-path=/usr/sbin/nginx --conf-path=/etc/nginx/nginx.conf --pid-path=/var/run/nginx.pid --lock-path=/var/run/nginx.lock --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --with-http_gzip_static_module --with-http_stub_status_module --with-http_ssl_module --with-pcre --with-file-aio --with-http_realip_module --without-http_scgi_module --without-http_uwsgi_module --without-http_fastcgi_module --add-module=../ngx_pagespeed-release-${NPS_VERSION}-beta
make
make install
useradd -r nginx
wget -O /etc/init.d/nginx https://raw.githubusercontent.com/Fleshgrinder/nginx-sysvinit-script/master/nginx
chmod 0755 /etc/init.d/nginx
chown root:root /etc/init.d/nginx
update-rc.d nginx defaults
cp -f ../../nginx.conf /etc/nginx/nginx.conf
service nginx start
