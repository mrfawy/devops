name              "time"
maintainer        "abdelm2"
maintainer_email  "abdelm2@nw.net"
license           "Apache 2.0"
description       "create a file wit htime"
version           "1.0.0"



recipe "time", "create a time file "


%w{ debian ubuntu centos redhat fedora freebsd smartos }.each do |os|
  supports os
end
