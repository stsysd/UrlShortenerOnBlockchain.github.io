let TextShortner = artifacts.require('TextShortener');

contract('TestTextShortner', function(accounts) {
  it("should assert true", function(done) {
    var text_shortner = TextShortner.deployed();
    assert.isTrue(true);
    done();
  });

  it("should return registered Text", function(done) {
    TextShortner.deployed().then(instance => {
      instance.register("www.google.com", { from: accounts[0] });
      instance.getKey("www.google.com").then(key => {
        return instance.getText(key);
      }).then(url => {
        assert.equal(url, "www.google.com");
        done();
      });
    });
  });
});
