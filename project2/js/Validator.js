//Doi tượng
function Validator(options) {
  var selectorRules = {};
  function validate(inputElement, rule) {
    var errorMessage;
    var errorElement = inputElement.parentElement.querySelector(
      options.errorSelector
    );

    //lấy qua các rule của selector
    var rules = selectorRules[rule.selector];

    // lặp qua từng rule
    // nếu có lỗi thì dừng việc kiểm tra
    for (var i = 0; i < rules.length; i++) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) break;
    }
    if (errorMessage) {
      errorElement.innerText = errorMessage;
      inputElement.parentElement.classList.add("invalid");
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }
    return !errorMessage;
  }
  var formElement = document.querySelector(options.form);
  if (formElement) {
    formElement.onsubmit = function (e) {
      e.preventDefault();
      // localStorage.clear();
      var isFormValid = true;
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });
      if (isFormValid) {
        // if (typeof option.onSubmit === "function") {
        //   var enableInputs = formElement.querySelectorAll("[name]");
        //   var formValues = Array.from(enableInputs).reduce(function (
        //     values,
        //     input
        //   ) {
        //     values[input.name] = input.value;
        //     return values;
        //   },
        //   {});
        if (typeof options.onSubmit === "function") {
          var enableInputs = formElement.querySelectorAll("[name]");
          var formValues = Array.from(enableInputs).reduce(function (
            values,
            input
          ) {
            return (values[input.name] = input.value) && values;
          },
          {});
          var existingData = localStorage.getItem("users");
          var parsedData = existingData ? JSON.parse(existingData) : [];
          parsedData.push(formValues);
          localStorage.setItem("users", JSON.stringify(parsedData));
          options.onSubmit(formValues);
        }
      }
    };
    //lặp qua mỗi rule và xử lý
    options.rules.forEach(function (rule) {
      //lưu lại các rules cho mỗi input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }
      var inputElement = formElement.querySelector(rule.selector);

      if (inputElement) {
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };

        // xử lý khi người dùng nhập input
        inputElement.oninput = function () {
          var errorElement =
            inputElement.parentElement.querySelector(".form-message");
          errorElement.innerText = "";
          inputElement.parentElement.classList.remove("invalid");
        };
      }
    });
  }
}
// Định nghĩa các rules
// 1.khi có lỗi => trả ra message lỗi
// 2. khi hợp lệ => ko trả ra cái j cả(undefined)
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : message || "Vui lòng nhập trường này";
    },
  };
};
Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regexEmail.test(value)
        ? undefined
        : message || "Trường này phải là email";
    },
  };
};
Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : message || `Vui lòng nhập tối thiểu ${min} ký tự`;
    },
  };
};
Validator.isConfirmed = function (selector, getCofirmValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getCofirmValue()
        ? undefined
        : message || "Giá trị nhập vào không chính xác";
    },
  };
};
Validator.isEmailNotExists = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var existingData = localStorage.getItem("users");
      var parsedData = existingData ? JSON.parse(existingData) : [];

      var isEmailExists = parsedData.some((user) => user.email === value);

      return isEmailExists ? message || "Email đã tồn tại" : undefined;
    },
  };
};
Validator.isNameNotExists = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var existingData = localStorage.getItem("users");
      var parsedData = existingData ? JSON.parse(existingData) : [];

      var isNameExists = parsedData.some((user) => user.fullname === value);

      return isNameExists ? message || "Tên đã tồn tại" : undefined;
    },
  };
};
