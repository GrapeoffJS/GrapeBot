export class MongoDBConnectionURIBuilder {
    private protocol = '';
    private username = '';
    private password = '';
    private hostname = '';
    private queryParams = '';

    public setProtocol(protocol: string) {
        this.protocol = protocol;
        return this;
    }

    public setUsername(username: string) {
        this.username = username;
        return this;
    }

    public setPassword(password: string) {
        this.password = password;
        return this;
    }

    public setHostname(hostname: string) {
        this.hostname = hostname;
        return this;
    }

    public setQueryParams(queryParams: string) {
        this.queryParams = queryParams;
        return this;
    }

    public build() {
        return `${this.protocol}://${this.username}:${this.password}@${this.hostname}/?${this.queryParams}`;
    }
}
