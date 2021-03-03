const response = require("./response-handle")

const obj ={success:true,
            data:100,
            message:"Message received"
}
test('Test Response helper Function',() => {
    expect(response(true,100,"Message received")).toEqual(obj);
});