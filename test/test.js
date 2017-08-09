var utils = require('../build/utils');
var add = require('../testing.js');
require('should');
var chai = require('chai'),
  expect = chai.expect;

describe('大数相加add方法', function () {
  it('字符串"42329"加上字符串"21532"等于"63861"', function () {
    add('42329', '21532')
      .should.equal('63861')
  })
  
  it('"843529812342341234"加上"236124361425345435"等于"1079654173767686669"', function () {
    add('843529812342341234', '236124361425345435')
      .should.equal('1079654173767686669')

    expect(add('843529812342341234', '236124361425345435'))
      .to.equal('1079654173767686669')
  })
})

describe('测试 utils 里面的方法', function(){

  it('—— 测试getAllEntries', function(){
    expect(utils.getAllEntries).to.be.an('array')
    expect(utils.getAllEntries).to.include('index')
    expect(utils.getAllEntries).to.be.ok
    expect(utils.getAllEntries).to.be.exist
    expect(utils.getAllEntries).not.to.be.empty
    expect(utils.getAllEntries).to.deep.equal([ 'index', 'login' ])
    expect(utils.getAllEntries).to.have.length.above(1)
  })

})