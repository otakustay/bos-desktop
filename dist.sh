rm -rf dist

mkdir dist

# service
babel service --out-dir dist/service
# static
babel static --ignore src/external,dep/**/test,dep/etpl --out-dir dist/static
cp -r static/src/external dist/static/src
cp -r static/dep/etpl dist/static/dep
cp static/*.html dist/static
# other
babel *.js --out-dir dist/
cp package.json dist/

if [ "$1" == "--install" ]
then
    cd dist
    npm install --production
    cd ..
fi
