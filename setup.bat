@echo off
setlocal
@title 모듈 설치기

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:LOOP
set /p YN=NODE.JS가 설치 되어있나요? (Y/N)

if /i "%YN%" == "y" goto YES
if /i "%YN%" == "n" goto NO

goto LOOP
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

:YES
goto A1

:NO
start https://nodejs.org/dist/v10.14.1/node-v10.14.1-x64.msi
cls
echo node.js 설치기를 설치중입니다.
echo node.js 를 설치후 다시 진행해주세요!
pause
goto QUIT

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:A1
set /p YN=모듈들이 설치되어 있습니까?(Y/N)

if /i "%YN%" == "y" goto A2
if /i "%YN%" == "n" goto B2

goto A1
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

:A2
pushd "%~dp0"
node Main.js

:B2
echo 필요한 모듈을 설치중입니다.
pause
npm i discord.js
pause
echo 필요한 모듈을 설치했습니다.
pause


:QUIT