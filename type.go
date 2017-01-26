package discoverer

type serviceInfo struct {
	host, ip, name, id string
}

type Json map[string]string

type clients struct {
	registries []serviceInfo
}

func (c *clients) New() *clients {
	return &clients{}
}

func (c *clients) AddClient(m serviceInfo) {
	c.registries = append(c.registries, m)
}

func (c *clients) all() []serviceInfo {
	return c.registries
}

func (c *clients) removeClient(sinfo serviceInfo) {
	for i := 0; i < len(c.registries); i++ {
		currentClient := c.registries[i]
		if currentClient.name == sinfo.name && currentClient.id == sinfo.id {
			c.registries = append(c.registries[:i], c.registries[i+1:]...)
		}
	}
}
