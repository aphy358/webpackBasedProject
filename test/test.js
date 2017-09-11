var util = require('../src/common/util');

require('should');

var chai = require('chai'),
    expect = chai.expect;


describe('测试 utils 里面的方法', function () {

    it('—— 测试 processAfterTyping', function () {
        function cb(say){
            console.log(say);
        }
        expect(util.processAfterTyping(cb, 300, 'option')).to.be.ok;
        // expect(utils.getAllEntries).to.include('index')
        // expect(utils.getAllEntries).to.be.ok
        // expect(utils.getAllEntries).to.be.exist
        // expect(utils.getAllEntries).not.to.be.empty
        // expect(utils.getAllEntries).to.deep.equal(['index', 'login'])
        // expect(utils.getAllEntries).to.have.length.above(1)
    })

})