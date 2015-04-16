name             'grails'
maintainer       'Abdelm2'
maintainer_email 'Email not defined'
license          'All rights reserved'
description      'Installs/Configures grails'
long_description IO.read(File.join(File.dirname(__FILE__), 'README.md'))
version          '0.1.0'

depends 'zip' , '~> 1.1.0'
depends 'java', '~> 1.31.0'

recipe "grails", "setup grails "

%w{ debian ubuntu centos redhat }.each do |os|
  supports os
end
