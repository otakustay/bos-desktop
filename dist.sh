rm -rf dist

mkdir dist

# service
babel --presets=es2015,stage-0 service/**/*.js service/*.js --out-dir dist/
# static
babel --presets=es2015,stage-0 --plugins=transform-es2015-modules-amd static/**/*.js --out-dir dist/
cp static/src/external/* dist/static/src/external
cp static/*.html dist/static
# other
babel --presets=es2015,stage-0 *.js --out-dir dist/
cp package.json dist/

if [ "$1" == "--install" ]
then
    cd dist
    npm install --production
    cd ..
fi
