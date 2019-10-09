git pull
cp ~/workspace/vtrans/otp-vtrans-ui/vtrans_ui_config_qa.js ~/workspace/vtrans/otp-vtrans-ui/src/config.js
npm install
npm run build
tar -cvzf oc_otp_ui.tgz dist