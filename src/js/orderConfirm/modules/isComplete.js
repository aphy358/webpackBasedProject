//加载确认订单信息的模板
const confirmOrderMsg = require('../templates/confirmOrderMsg.ejs');

//用户点击支付时，检查信息是否填写完整
function isComplete() {
    //因为其他地方都是预先填好的，用户只能改不能删，所以只需要验证入住信息与验证方式非在线验证时信息是否为空
    $('.payment-confirm button').click(function () {
	    //******** 提交表单之前进行验证
	    if (!$("#orderForm").myValid()){
	        //将页面回滚到第一个验证不通过的地方
	        //获取第一个验证不通过的元素的位置
	        var failedTest=$('.error')[0].offsetTop-80;
	      
	        $('body, html').animate({
		      	scrollTop:failedTest+"px"
	        },200);
        
	        return;
	    }else{
        //取得form表单的数据
        var formData = $('form').serialize();
        //处理该数据
        var formify = formData.split('&');
        var formObj = {};
        for (var i = 0; i < formify.length; i++) {
          var formSingle = formify[i].split('=');
          formObj[formSingle[0]] = formSingle[1];
        }
        //将加床、加早、加宽带信息加入到formObj中
        formObj['breakfastNum'] = 0;
        formObj['bedNum'] = 0;
        formObj['networkNum'] = 0;
        var addBreakFastMsg = $('.hotel-breakfast-box .hotel-item .hotel-item-left');
        var addBreakFastNum = $('.hotel-breakfast-box .hotel-item .hotel-item-left .add-num');
          for (var breakfast = 0; breakfast < addBreakFastNum.length; breakfast++) {
            formObj['breakfastNum'] += +($(addBreakFastNum[breakfast]).text());
          }
        
        var addBedMsg = $('.hotel-bed-box .hotel-item .hotel-item-left');
        var addBedNum = $('.hotel-bed-box .hotel-item .hotel-item-left .add-num');
          for (var bed = 0; bed < addBedNum.length; bed++) {
            formObj['bedNum'] += +($(addBedNum[bed]).text());
          }
        
        var addNetworkMsg = $('.hotel-network-box .hotel-item .hotel-item-left');
        var addNetworkNum = $('.hotel-network-box .hotel-item .hotel-item-left .add-num');
          for (var network = 0; network < addNetworkNum.length; network++) {
            formObj['networkNum'] += +($(addNetworkNum[network]).text());
          }
        
        
        formObj['addBreakfastMsg'] = addBreakFastMsg.eq(0).text();
        formObj['addBedMsg'] = addBedMsg.eq(0).text();
        formObj['addNetworkMsg'] = addNetworkMsg.eq(0).text();
        for (var j = 1; j < addBreakFastMsg.length; j++) {
          formObj['addBreakfastMsg'] += ';' + addBreakFastMsg.eq(j).text();
        }
        for (var y = 1; y < addBedMsg.length; y++) {
          formObj['addBedMsg'] += ';' + addBedMsg.eq(y).text();
        }
        for (var z = 1; z < addNetworkMsg.length; z++) {
          formObj['addNetworkMsg'] += ';' + addNetworkMsg.eq(z).text();
        }
        
        //个性化要求信息
        formObj['specialReq'] = $("input[name='specialReq']:checked").serialize();
        
        //用户支付总价
        formObj['payTotalMoney'] = +$('#totalPay').text();
        
        formObj['paymentTermName'] = ["客人前台现付", '单结', '周结', '半月结', '月结','不固定', '三日结', '十日结','额度结'];
        
        //入住人信息
        var guestArr = [];
        var guestCollect = $('.guest');
        for (var i = 0; i < guestCollect.length; i++) {
          var surnameCollect = $(guestCollect[i]).find('.first-name');
          var afternameCollect = $(guestCollect[i]).find('.last-name');
          if($(guestCollect[i]).find('.nationality-msg')){
            //国外
            var nationalCollect= $(guestCollect[i]).find('.nationality-msg');
            if( surnameCollect.val().replace(/^\s+|\s+$/g, '')){
              guestArr[guestArr.length] = {};
              //此时数组的长度已经发生变化，所以下面赋值时需-1
              guestArr[guestArr.length-1].surname = $(surnameCollect).val();
              guestArr[guestArr.length-1].aftername = $(afternameCollect).val();
              guestArr[guestArr.length-1].national = $(nationalCollect).val();
            }
          }else{
            //国内
            if( surnameCollect.val().replace(/^\s+|\s+$/g, '')){
              guestArr[guestArr.length] = {};
              guestArr[guestArr.length-1].surname = $(surnameCollect).val();
              guestArr[guestArr.length-1].aftername = $(afternameCollect).val();
            }
          }
        }
    
        formObj['guestArr'] = $(guestArr);
        console.log(formObj);
        //将获取的数据嵌入弹出的确认订单信息框中
        var $confirmOrderMsgStr = $(confirmOrderMsg(formObj));
        
        //用户点击确认之后，隐藏确认订单信息框
        $confirmOrderMsgStr.on('click','.confirm-order',function () {
          $('.confirm-order-msg-box').remove();
          $('.confirm-order-msg').remove();
          
          //进行验价
          //获取参数
          var params = {
            staticInfoId:438,
            adultNum:1,
            dateNum:3,
            childrenNum:2,
            childrenAgeStr:null,
            isQueryPrice:,
            supplierId:105,
            roomId:125067,
            rateType:2,
            paymentType:0,
            paymentTerm:1,
            willUsedBalance:0,
            hotelPrice.supplierId:105,
            hotelPrice.hotelId:438,
            hotelPrice.roomId:125067,
            hotelPrice.roomName:overseas,
            hotelPrice.totalPriceRMB:1800.00,
            hotelPrice.totalNowPriceRMB:0.00,
            hotelPrice.totalPrice:252.00,
            hotelPrice.averagePrice:28.00,
            hotelPrice.taxesAndFees:,
          hotelPrice.extraPersonFees:,
          hotelPrice.taxesAndFeesRMB:,
          hotelPrice.extraPersonFeesRMB:,
          hotelPrice.cancellationType:,
          hotelPrice.clause:3_0_0_0_0,
            hotelPrice.cancellationDesc:此房即订即保，一但预订。不可修改或取消,
            hotelPrice.currentAlloment:,
          hotelPrice.breakFastName:一份早餐,
            hotelPrice.breakfastPriceBase:,
          hotelPrice.breakfastPriceRMB:,
          hotelPrice.internet:,
          hotelPrice.arriveStartTime:,
          hotelPrice.arriveEndTime:,
          hotelPrice.rateType:2,
            hotelPrice.rateTypeName:单早,
            hotelPrice.breakFastId:8,
            hotelPrice.paymentType:0,
            hotelPrice.confirm:true,
            hotelPrice.supplierAttr:,
          hotelPriceStrs:[{"date":"2017-09-05","formulaType":"1","occupancyStock":3,"price":28,"salePrice":200,"nowPrice":0,"skuId":153426,"stock":100,"sellStock":0,"status":1,"clauses":[{"createTime":null,"createBy":null,"updateTime":null,"updateBy":null,"orderBy":null,"limitString":null,"andWhereString":null,"and_where_string":null,"or_where_string":null,"clauseId":3603507,"itemId":440,"staticInfoId":438,"skuId":7198,"clauseType":1,"clauseNumber":3,"clauseDate":0,"clauseTime":0,"cancelFineType":0,"cancelFine":null,"remark":null,"attr":"","companyAccountId":null,"subAccountId":null,"bookBeginDate":null,"bookBeginDateStr":null,"bookEndDate":null,"bookEndDateStr":null,"checkInDate":null,"checkInDateStr":null,"checkOutDate":null,"checkOutDateStr":null,"formulaType":null,"default":false}],"nightlyStr":null,"discount":null,"reserveShow":null},{"date":"2017-09-06","formulaType":"1","occupancyStock":3,"price":28,"salePrice":200,"nowPrice":0,"skuId":153427,"stock":100,"sellStock":0,"status":1,"clauses":[{"createTime":null,"createBy":null,"updateTime":null,"updateBy":null,"orderBy":null,"limitString":null,"andWhereString":null,"and_where_string":null,"or_where_string":null,"clauseId":3603507,"itemId":440,"staticInfoId":438,"skuId":7198,"clauseType":1,"clauseNumber":3,"clauseDate":0,"clauseTime":0,"cancelFineType":0,"cancelFine":null,"remark":null,"attr":"","companyAccountId":null,"subAccountId":null,"bookBeginDate":null,"bookBeginDateStr":null,"bookEndDate":null,"bookEndDateStr":null,"checkInDate":null,"checkInDateStr":null,"checkOutDate":null,"checkOutDateStr":null,"formulaType":null,"default":false}],"nightlyStr":null,"discount":null,"reserveShow":null},{"date":"2017-09-07","formulaType":"1","occupancyStock":3,"price":28,"salePrice":200,"nowPrice":0,"skuId":153428,"stock":100,"sellStock":0,"status":1,"clauses":[{"createTime":null,"createBy":null,"updateTime":null,"updateBy":null,"orderBy":null,"limitString":null,"andWhereString":null,"and_where_string":null,"or_where_string":null,"clauseId":3603507,"itemId":440,"staticInfoId":438,"skuId":7198,"clauseType":1,"clauseNumber":3,"clauseDate":0,"clauseTime":0,"cancelFineType":0,"cancelFine":null,"remark":null,"attr":"","companyAccountId":null,"subAccountId":null,"bookBeginDate":null,"bookBeginDateStr":null,"bookEndDate":null,"bookEndDateStr":null,"checkInDate":null,"checkInDateStr":null,"checkOutDate":null,"checkOutDateStr":null,"formulaType":null,"default":false}],"nightlyStr":null,"discount":null,"reserveShow":null}],
            bedTypeStrs:,
          startDate:2017-09-05,
            endDate:2017-09-08,
            roomNum:3,
            userNames:d#d#阿森松岛,d#d#阿拉伯联合酋长国,d#d#爱尔兰,
            surname:d,
            userName:d,
            countryId:阿森松岛,
            surname:,
          userName:,
          countryId:,
          surname:d,
            userName:d,
            countryId:阿拉伯联合酋长国,
            surname:,
          userName:,
          countryId:,
          surname:d,
            userName:d,
            countryId:爱尔兰,
            surname:,
          userName:,
          countryId:,
          specialRequire:,
          checkType:9,
            voucherEmail:,
          voucherFax:,
          voucherMobile:,
          payTotalMoney:1800.0,
            toatlBasePrice:252.0,
            totalNowPrice:0.0
        }
          //发送请求
          const checkThePrice = require('./sendRequest.js').checkThePrice;
          checkThePrice(params,function (data) {
            console.log(data);
          })
        });
        //用户点击取消之后，隐藏确认订单信息框
        $confirmOrderMsgStr.on('click','.cancel-order',function () {
          $('.confirm-order-msg-box').remove();
          $('.confirm-order-msg').remove();
        });
        
        $('.main').append($confirmOrderMsgStr);
		  	return false;
	    }

	    //跳转到确认支付页面
	})
}

module.exports = isComplete;
