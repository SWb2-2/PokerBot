const index = require("../../website/js/index");

describe("Check that index functions are working", () => {
    test("Sending balance and changing location", async() => {
        document.body.innerHTML = '<input id="balance" name="balance" type="number" min="50" max="1000000" required/>';
        delete window.location;

        window.location = {
            href: "game.html"
        };

        global.fetch = jest.fn().mockImplementation(() => {
            var res = new Promise((resolve, reject) => {
                resolve({
                    redirected: true,
                    url: "game.html"
                });
            });
            return res;
        });

        const response = await index.sendInfo();

        expect(global.fetch.mock.calls.length).toBe(1)
        expect(window.location.href).toBe("game.html");
        expect(response).toBe(true);
    });
    test("Sending balance and not changing location", async() => {
        document.body.innerHTML = '<input id="balance" name="balance" type="number" min="50" max="1000000" required/>';
        delete window.location;

        window.location = {
            href: "index.html"
        };

        global.fetch = jest.fn().mockImplementation(() => {
            var res = new Promise((resolve, reject) => {
                resolve({
                    redirected: false,
                    url: "game.html"
                });
            });
            return res;
        });

        const response = await index.sendInfo();

        expect(global.fetch.mock.calls.length).toBe(1)
        expect(window.location.href).toBe("index.html");
        expect(response).toBe(false);
    });
});