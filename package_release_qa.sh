git pull
cp ~/workspace/vtrans_ui/otp-vtrans-ui/vtrans_ui_config_qa.js ~/workspace/vtrans_ui/otp-vtrans-ui/src/config.js
npm install
npm run build
tar -cvzf oc_otp_ui.tgz dist