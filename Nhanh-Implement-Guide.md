## config ##
lấy config cho php /configs/app-production.php 

Tại màn hình Firebase console (trong dự án) > overview > Add Firebase to your web app
Copy các phần apiKey, projectId, messagingSenderId vào config firebase trong file php

Tại màn hình Firebase console (trong dự án) > setting (icon bánh răng cạnh overview) > project settings > cloud messaging > kéo xuống dưới Web configuration > Web Push certificates > bấm generate new pair key. 
Copy key vào phần publicVapidKey trong config firebase trong file php


## index database ##

# accounts #
- identifier ASC
- serviceId ASC

# accounts-devices #
- accountId ASC
- deviceId ASC
- accountIdentifier ASC
- deviceToken ASC

# devices #
- token ASC

# organizations #
- serviceId ASC
- identifier DESC

# organizations-accounts #
- organizationId DESC
- accountId DESC
- accountIdentifier DESC
- organizationIdentifier DESC

# services #
- token ASC

# topics #
- serviceId ASC
- status ASC
- type ASC
- sendMode ASC
- code ASC
- organizationIdentifier DESC
- organizationId DESC

# devices-topics #
- status ASC
- serviceId ASC
- deviceId ASC
- topicId ASC

# users #
- email ASC

# messages #
- topicId
- organizationId
- updatedDateTime
- createdDateTime