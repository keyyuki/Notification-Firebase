###Notification Firebase ###

##Giới thiệu chung ##

Là hệ thống quản lí việc push notification cho các app thuộc các hệ thống con. 

Nếu có gì không hiểu có thể liên hệ email keyyuki@gmail.com hoặc skype EOF200 để được giải thích rõ hơn.

Tài liệu dự án sẽ upload sau

##Cách implement ##

Yêu cầu cần có 1 dự án firebase. Tạo trên trang (https://console.firebase.google.com/u/0/)

Tạo 1 host function theo hướng dẫn https://firebase.google.com/docs/functions/get-started?authuser=0

checkout git này về, thay tên project trong file .firebaserc thành tên dự án của bạn

install node_modules cho /functions

Tại trang firebase project của bạn, generate 1 account service (project settings > service accounts > generate new private key), copy file service account đó vào thư mục ./functions/config/development. Đổi tên file thành "google-json-key.json"

Ok thế là xong rồi đó. Nhưng ko dc giải thích về cấu trúc thì cũng chả chạy dc được đâu. Rất cảm ơn bạn đã chịu khó đọc hết từ nãy đến giờ.

##Licence ##

Published by Nhanh.vn

