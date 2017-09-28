describe("Rune.Noise", function() {

  it("should return noise", function() {
    var noise = new Rune.Noise();
    noise.noiseSeed(1);
    expect(noise.get(1)).toEqual(0.3180446257465519);
    expect(noise.get(2)).toEqual(0.32062402117298916);
    expect(noise.get(3)).toEqual(0.6280820905813016);
  });

});
