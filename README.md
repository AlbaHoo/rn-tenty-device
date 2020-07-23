HELONG android application written with React Native

# Development:

PATH alias is defined at `.babelrc`

All code should be put into src folder

- components
- pages
- containers
- assets
      - js
      - styles
      - images
      - fonts

# START emulator

run

    yarn android

# Build Release

cd android && ./gradlew assembleRelease
aliyun oss cp /Users/Alba/Develops/helong/mobile_react_native/android/app/build/outputs/apk/release/app-release.apk oss://helon/app.apk
aws s3 cp /Users/Alba/Develops/helong/mobile_react_native/android/app/build/outputs/apk/release/app-release.apk s3://tenty-misc/helong/app-beta.apk
