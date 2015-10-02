Usine.Set("Person", function(Usine) {
    return {
        LastName: "",
        title: "Mr.",

        Make: function(name) {
            this.LastName = name;
        },

        speak: function() {
            return "I am " + this.title + " " + this.LastName + " !";
        },

        Speak: function() {
            return this.speak();
        },

        GetTitle: function() {
            return this.title;
        },

        SetTitle: function(title) {
            this.title = title;
        }
    };
});

Usine.Set("Doctor extends Person", function(Usine) {
    return {    
        title: "Dr.",

        Heal: function() {
            return true;
        },
    };
});

QUnit.test("Test classes", function(assert) {
    var taylor = Usine.Make("Person", "Taylor");
    var davis = Usine.Make("Person", "Davis");
    var jones = Usine.Make("Doctor", "Jones");

    assert.ok(taylor.LastName === "Taylor", "Test Taylor last name.");
    assert.ok(davis.LastName === "Davis", "Test Davis last name.");
    assert.ok(jones.LastName === "Jones", "Test Jones last name.");

    assert.ok(taylor.GetTitle() === "Mr.", "Test Taylor title.");
    assert.ok(davis.GetTitle() === "Mr.", "Test Davis title.");
    assert.ok(jones.GetTitle() === "Dr.", "Test Jones title.");

    try {
        console.log(taylor.title);
        assert.ok(false, "Read private attribute.");
    } catch(e) {
        assert.ok(true, "Read private attribute.");
    }

    try {
        taylor.title = "King";
        assert.ok(false, "Write private attribute.");
    } catch(e) {
        assert.ok(true, "Write private attribute.");
    }

    assert.ok(davis.GetTitle() === "Mr.", "Use getter.");

    davis.SetTitle("King");
    assert.ok(taylor.GetTitle() === "Mr.", "Use getter.");
    assert.ok(davis.GetTitle() === "King", "Use setter on modified.");
    assert.ok(jones.GetTitle() === "Dr.", "Use setter on parent.");

    try {
        davis.speak();
        assert.ok(false, "Private method.");
    } catch(e) {
        assert.ok(true, "Private method.");
    }

    davis.speak = function() { return "..."; };
    assert.ok(davis.Speak() === "I am King Davis !", "Redefine private method.");

    davis.Speak = function() { return "..."; };
    assert.ok(davis.Speak() === "I am King Davis !", "Redefine private method.");

    assert.ok(taylor.Speak() === "I am Mr. Taylor !", "Use public method using private attributes.");

    assert.ok(jones.Heal(), "Doctor specific function.");

    try {
        taylor.Heal();
        assert.ok(false, "Can not use Doctor specific function");
    } catch(e) {
        assert.ok(true, "Can not use Doctor specific function");
    }
});