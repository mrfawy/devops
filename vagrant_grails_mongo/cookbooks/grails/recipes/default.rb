#
# Cookbook Name:: grails
# Recipe:: default
#
# Copyright 2015, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#
include_recipe "zip"
include_recipe "java"

package ['tmux']

execute "install gvmtool" do
    command "su vagrant -l -c 'curl -s get.gvmtool.net | bash'"
    creates "/tmp/gvmtool"
    not_if { ::File.exists?("/tmp/gvmtool}")}
end

execute "init gvmtool" do
    command "su vagrant -l -c 'cat $HOME/.gvm/bin/gvm-init.sh |bash'"
    creates "/tmp/gvminit"
    not_if { ::File.exists?("/tmp/gvminit}")}
end




execute "install grails" do
    command "su vagrant -l -c 'yes | gvm install grails #{node[:grails][:version]}'"
    creates "/tmp/gvmgrails"
    not_if { ::File.exists?("/tmp/gvmgrails}")}
end
