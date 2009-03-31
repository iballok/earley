echo "* Implementation"
wc -l $(find -not -ipath *svn* -type f -and -not -ipath *theme* -and -not -ipath *test/* -and -not -iname *Application* -and -iname *.js)
echo "* Tests"
wc -l $(find -not -ipath *svn* -type f -and -not -ipath *theme* -and -ipath *test/* -and -not -iname *Application* -and -iname *.js)