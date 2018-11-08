var http = require('http')
var fs = require('fs')

var app = http.createServer(function (req, res) {
  if (req.url === '/') {
    fs.readFile('./pcas-code.json', function (err, data) {
      if (err) {
        console.log(err)
        res.end('Server Error')
      } else {
        var provinces = JSON.parse(data.toString())
        var result = []
        provinces.forEach(function (ele, index) {
          var provinceId = ele.value
          var label = ele.label
          var cityList = ele.children
          var cities = []
          if (cityList) {
            cityList.forEach(function (city, index) {
              var cityId = city.value
              var cityLabel = city.label
              var countyList = city.children
              var counties = []
              if (countyList) {
                countyList.forEach(function (county, index) {
                  var countyId = county.value
                  var countyLabel = county.label
                  var streetList = county.children
                  var streets = []
                  streetList.forEach(function (st, index) {
                    var streetId = st.value
                    var streetLabel = st.label
                    streets.push({
                      value: `${streetId}#${streetLabel}`,
                      label: streetLabel
                    })
                  })
                  counties.push({
                    value: `${countyId}#${countyLabel}`,
                    label: countyLabel,
                    children: streets
                  })
                })
              }
              cities.push({
                value: `${cityId}#${cityLabel}`,
                label: cityLabel,
                children: counties
              })
            })
          }
          result.push({
            value: `${provinceId}#${label}`,
            label: label,
            children: cities
          })
        })
        console.log(result)
        fs.writeFile(
          'pacas-code-convert.json',
          JSON.stringify(result),
          { encoding: 'utf-8', flag: 'w' },
          function (result) {
            alert('写文件成功')
          }
        )
      }
    })
  }
})

app.listen(3000, '127.0.0.1')
